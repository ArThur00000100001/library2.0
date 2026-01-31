import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, IMessage } from '../services/chat/chat.service';
import { AuthService } from '../../core/guard/auth.service';
import { IUser } from '../admin/models/types';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.html',
    styleUrl: './chat.scss',
    imports: [CommonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
    @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

    private readonly chatService = inject(ChatService);
    private readonly authService = inject(AuthService);

    readonly isOpen = signal(false);
    readonly selectedUser = signal<IUser | null>(null);
    readonly newMessage = signal('');
    readonly isTyping = signal(false);

    readonly currentUser = computed(() => this.authService.user() as IUser);
    readonly users = computed(() => {
        const currentUserId = this.currentUser()?.id;
        return this.chatService.apiListService.usersList().filter((u) => u.id !== currentUserId);
    });

    readonly typingStatus = computed(() => {
        const selected = this.selectedUser();
        if (!selected) return false;
        return this.chatService.typingUsers()[selected.id] || false;
    });

    readonly messagesForSelectedUser = computed(() => {
        const selected = this.selectedUser();
        const current = this.currentUser();
        if (!selected || !current) return [];

        return this.chatService
            .messages()
            .filter(
                (m) =>
                    (m.senderId === current.id && m.receiverId === selected.id) ||
                    (m.senderId === selected.id && m.receiverId === current.id),
            )
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    });

    constructor() {
        effect(() => {
            const msgs = this.messagesForSelectedUser();
            if (msgs.length > 0) {
                this.scrollToBottom();
                
                // Mark unread messages as read
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg.receiverId === this.currentUser()?.id && !lastMsg.isRead && lastMsg.id) {
                    this.chatService.markAsRead(lastMsg.id);
                }
            }
        });

        // Typing indicator effect
        effect((onCleanup) => {
            const typing = this.isTyping();
            const selected = this.selectedUser();
            if (typing && selected) {
                this.chatService.sendTyping(selected.id, true);
                const timeout = setTimeout(() => {
                    this.isTyping.set(false);
                    this.chatService.sendTyping(selected.id, false);
                }, 3000);
                onCleanup(() => clearTimeout(timeout));
            }
        });
    }

    private scrollToBottom() {
        setTimeout(() => {
            if (this.scrollContainer) {
                this.scrollContainer.nativeElement.scrollTop =
                    this.scrollContainer.nativeElement.scrollHeight;
            }
        }, 10);
    }

    toggleChat() {
        this.isOpen.update((v) => !v);
    }

    async selectUser(user: IUser) {
        this.selectedUser.set(user);
        await this.chatService.getConversation(user.id);
        this.scrollToBottom();
    }

    deselectUser() {
        this.selectedUser.set(null);
    }

    onType() {
        if (!this.isTyping()) {
            this.isTyping.set(true);
        }
    }

    sendMessage() {
        const content = this.newMessage().trim();
        const recipient = this.selectedUser();

        if (!content || !recipient) return;

        this.chatService.sendMessage(recipient.id, content);
        this.newMessage.set('');
        this.isTyping.set(false);
        this.chatService.sendTyping(recipient.id, false);
    }

    getInitials(name: string | null): string {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}

