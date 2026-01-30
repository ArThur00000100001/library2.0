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

    online = false;
    ejecutado = false;

    readonly comprobar = effect(() => {
        const list = this.usersList();
        const userId = this.authService.user().id;

        if (!this.online) return;

        if (this.ejecutado) return list;

        this.apiListService.usersList.set(
            list.map((u) => (u.id == userId ? { ...u, isOnline: true } : u)),
        );

        this.ejecutado = true;
        console.log(this.apiListService.usersList());

        return list;
    });

    constructor() {
        this.ngZone.runOutsideAngular(() => {
            this.apiListService.loadUserNeeded();
            const user = this.authService.user();
            this.socket = io(APIWS, { query: { userId: user.id } });

            //hace un llamado a la lista de uusarios conectados
            this.socket.emit('getOnlineUsers');
            //Obtiene la lista de usuario mediante el parametro
            this.socket.on('onlineUsers', (user) => {
                this.usersOnlineList.set(user);
            });

            //usuario conectado
            this.socket.on('userOnline', (user) => {
                console.log(`✅ Usuario ${user.userId} conectado`);
                this.usersOnlineList.update((list) => [...list, user]);
                this.online = true;
            });

            //usuario desconectado
            this.socket.on('userOffline', (user) => {
                console.log(`❌ Usuario ${user.userId} desconectado`);
                this.usersOnlineList.set(
                    this.usersOnlineList().filter((x) => x.userId != user.userId),
                );
            });
        });
    }
}
