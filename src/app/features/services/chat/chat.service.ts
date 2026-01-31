import { computed, effect, inject, Injectable, NgZone, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../../admin/models/types';
import { AuthService } from '../../../core/guard/auth.service';
import { apiUserService } from '../../admin/pages/users/apiUser.service';
import { API, APIWS } from '../../environment/environment';
import { ApiListService } from '../contentList/api-list.service';
import { ApiFetchService } from '../apiFetch.service';

export type IMessage = {
    id?: number;
    senderId: number;
    receiverId: number;
    content: string;
    isRead: boolean;
    createdAt: Date;
};

type IUserOnline = { userId: number };
type ITypingStatus = { userId: number; isTyping: boolean };

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    socket: Socket | null = null;

    private readonly authService = inject(AuthService);
    private readonly apiFetchService = inject(ApiFetchService);
    public readonly apiListService = inject(ApiListService);
    private readonly ngZone: NgZone = inject(NgZone);

    readonly usersOnlineList = signal<IUserOnline[]>([]);
    readonly messages = signal<IMessage[]>([]);
    readonly typingUsers = signal<Record<number, boolean>>({});
    readonly unreadCount = signal<number>(0);

    online = false;

    readonly verifyOnlineUser = effect(
        () => {
            const usersOnline = this.usersOnlineList();
            const currentUsers = this.apiListService.usersList();
            const onlineIds = new Set(usersOnline.map((u) => u.userId));

            const needsChange = currentUsers.some(
                (u) => u.isOnline !== onlineIds.has(u.id),
            );

            if (needsChange) {
                this.apiListService.usersList.update((list) =>
                    list.map((u) => ({
                        ...u,
                        isOnline: onlineIds.has(u.id),
                    })),
                );
            }
        },
        { allowSignalWrites: true },
    );

    constructor() {
        effect(() => {
            const user = this.authService.user();
            if (user && user.id) {
                this.connect(user.id);
                this.getUnreadCount(user.id);
            } else {
                this.disconnect();
            }
        });
    }

    private connect(userId: number) {
        if (this.socket) {
            this.disconnect();
        }

        this.ngZone.runOutsideAngular(() => {
            this.apiListService.loadUserNeeded();
            this.socket = io(APIWS, { query: { userId } });

            this.socket.emit('getOnlineUsers');

            this.socket.on('onlineUsers', (users: IUserOnline[]) => {
                this.ngZone.run(() => {
                    this.usersOnlineList.set(users);
                });
            });

            this.socket.on('userOnline', (user: IUserOnline) => {
                this.ngZone.run(() => {
                    this.usersOnlineList.update((list) => {
                        if (list.some(u => u.userId === user.userId)) return list;
                        return [...list, user];
                    });
                    this.online = true;
                });
            });

            this.socket.on('userOffline', (user: IUserOnline) => {
                this.ngZone.run(() => {
                    this.usersOnlineList.update((list) =>
                        list.filter((x) => x.userId != user.userId),
                    );
                });
            });

            this.socket.on('newMessage', (message: any) => {
                this.ngZone.run(() => {
                    const mappedMessage: IMessage = {
                        ...message,
                        createdAt: new Date(message.createdAt)
                    };

                    this.messages.update((msgs) => {
                        // Avoid duplicates by ID or by content/time heuristic
                        const exists = msgs.some(m => 
                            (m.id && mappedMessage.id && m.id === mappedMessage.id) || 
                            (m.content === mappedMessage.content && 
                             m.senderId === mappedMessage.senderId && 
                             m.receiverId === mappedMessage.receiverId &&
                             Math.abs(m.createdAt.getTime() - mappedMessage.createdAt.getTime()) < 5000)
                        );
                        if (exists) {
                            // If it exists but didn't have an ID (optimistic), update it with the server ID
                            return msgs.map(m => {
                                if (!m.id && 
                                    m.content === mappedMessage.content && 
                                    m.senderId === mappedMessage.senderId && 
                                    m.receiverId === mappedMessage.receiverId) {
                                    return mappedMessage;
                                }
                                return m;
                            });
                        }
                        
                        // Add and sort to ensure chronological order (newest at the bottom)
                        const newList = [...msgs, mappedMessage];
                        return newList.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                    });
                    
                    if (message.receiverId === this.authService.user()?.id && !message.isRead) {
                        this.getUnreadCount(this.authService.user()!.id!);
                    }
                });
            });

            this.socket.on('userTyping', (data: ITypingStatus) => {
                this.ngZone.run(() => {
                    this.typingUsers.update(prev => ({
                        ...prev,
                        [data.userId]: data.isTyping
                    }));
                });
            });

            this.socket.on('messageRead', (data: { messageId: number, readAt: string }) => {
                this.ngZone.run(() => {
                    this.messages.update(msgs => 
                        msgs.map(m => m.id === data.messageId ? { ...m, isRead: true } : m)
                    );
                });
            });

            this.socket.on('error', (err: any) => {
                console.error('Socket error:', err);
            });
        });
    }

    async getConversation(otherUserId: number) {
        const currentUser = this.authService.user();
        if (!currentUser?.id) return;

        const response = await this.apiFetchService.getApiAuth<IMessage[]>(
            `${API}/messages/conversation/${currentUser.id}/${otherUserId}`
        );

        if (response.status === 'success') {
            const history = response.data.map(m => ({
                ...m,
                createdAt: new Date(m.createdAt)
            }));
            
            this.messages.update(currentMsgs => {
                const combined = [...currentMsgs];
                history.forEach(h => {
                    const existingIdx = combined.findIndex(m => 
                        (m.id && h.id && m.id === h.id) || 
                        (!m.id && m.content === h.content && m.senderId === h.senderId && m.receiverId === h.receiverId && Math.abs(m.createdAt.getTime() - h.createdAt.getTime()) < 2000)
                    );

                    if (existingIdx === -1) {
                        combined.push(h);
                    } else {
                        // Update existing (useful for ID assignment and read status)
                        combined[existingIdx] = { ...combined[existingIdx], ...h };
                    }
                });
                return combined.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            });
        }
    }

    async getUnreadCount(userId: number) {
        const response = await this.apiFetchService.getApiAuth<{ unreadCount: number }>(
            `${API}/messages/unread/${userId}`
        );
        if (response.status === 'success') {
            this.unreadCount.set(response.data.unreadCount);
        }
    }

    sendMessage(receiverId: number, content: string) {
        const currentUser = this.authService.user();
        if (!this.socket || !currentUser?.id) return;

        const messageData: IMessage = {
            senderId: currentUser.id,
            receiverId,
            content,
            isRead: false,
            createdAt: new Date(),
        };

        this.socket.emit('message', {
            senderId: currentUser.id,
            receiverId,
            content,
        });

        // Optimistic update with sorting
        this.messages.update((msgs) => [...msgs, messageData].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
    }

    sendTyping(receiverId: number, isTyping: boolean) {
        const currentUser = this.authService.user();
        if (!this.socket || !currentUser?.id) return;

        this.socket.emit('typing', {
            senderId: currentUser.id,
            receiverId,
            isTyping,
        });
    }

    markAsRead(messageId: number) {
        if (!this.socket) return;
        this.socket.emit('markAsRead', { messageId });
        
        // Also update local state
        this.messages.update(msgs => 
            msgs.map(m => m.id === messageId ? { ...m, isRead: true } : m)
        );
    }

    private disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.online = false;
        }
    }
}

