import { computed, effect, inject, Injectable, NgZone, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../../admin/models/types';
import { AuthService } from '../../../core/guard/auth.service';
import { apiUserService } from '../../admin/pages/users/apiUser.service';
import { APIWS } from '../../environment/environment';
import { ApiListService } from '../contentList/api-list.service';

export type IChat = {
    socketId: number;
    userId: number;
};

export type IMessage = {
    content: string;
    senderId: number;
};

type IUserOnline = { userId: number };

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    socket: Socket | null = null;

    readonly authService = inject(AuthService);
    readonly usersApiService = inject(apiUserService);

    private ngZone: NgZone = inject(NgZone);

    readonly usersOnlineList = signal<IUserOnline[]>([]);

    readonly apiListService = inject(ApiListService);
    readonly usersList = this.apiListService.usersList;
    readonly userOnlineId = signal<number>(0);

    online = false;
    ejecutado = false;

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

    // readonly comprobar = effect(() => {
    //     const list = this.usersList();
    //     const userId = this.authService.user().id;

    //     if (!this.online) return;

    //     if (this.ejecutado) return this.apiListService.usersList();
    //     this.apiListService.usersList.set(
    //         list.map((u) => (u.id == userId ? { ...u, isOnline: true } : u)),
    //     );

    //     this.ejecutado = true;
    //     console.log('desde el chat', this.apiListService.usersList());

    //     return this.apiListService.usersList();
    // });

    constructor() {
        effect(() => {
            const user = this.authService.user();
            if (user && user.id) {
                this.connect(user.id);
            } else {
                this.disconnect();
            }
        });
    }

    private connect(userId: number) {
        if (this.socket) {
            console.log('🔌 Ya existe una conexión, reconectando...');
            this.disconnect();
        }

        this.ngZone.runOutsideAngular(() => {
            this.apiListService.loadUserNeeded();
            this.socket = io(APIWS, { query: { userId } });

            //hace un llamado a la lista de uusarios conectados
            this.socket.emit('getOnlineUsers');

            //Obtiene la lista de usuario mediante el parametro
            this.socket.on('onlineUsers', (users) => {
                this.ngZone.run(() => {
                    this.usersOnlineList.set(users);
                });
            });

            //usuario conectado
            this.socket.on('userOnline', (user) => {
                console.log(`✅ Usuario ${user.userId} conectado`);
                this.ngZone.run(() => {
                    this.usersOnlineList.update((list) => [...list, user]);
                    this.userOnlineId.set(user.userId);
                    this.online = true;
                });
            });

            //usuario desconectado
            this.socket.on('userOffline', (user) => {
                console.log(`❌ Usuario ${user.userId} desconectado`);
                this.ngZone.run(() => {
                    this.usersOnlineList.update((list) =>
                        list.filter((x) => x.userId != user.userId),
                    );
                });
            });
        });
    }

    private disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.online = false;
            console.log('🔌 Socket desconectado');
        }
    }
}
