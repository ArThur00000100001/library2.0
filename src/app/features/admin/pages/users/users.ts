import {
    Component,
    ChangeDetectionStrategy,
    signal,
    inject,
    computed,
    effect,
} from '@angular/core';
import { apiUserService } from './apiUser.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersFormComponent } from './usersFormAdmin/userFormAdmin';
import { IUser } from '../../models/types';
import { ApiListService } from '../../../services/contentList/api-list.service';
import { ChatService } from '../../../services/chat/chat.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.html',
    styleUrl: './users.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
    constructor() {
        console.log('Dia', new Date().toISOString().split('T')[0]);
        //this.apiListService.loadUserNeeded();
        //console.log(`${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`);
    }

    readonly apiUserService = inject(apiUserService);
    readonly modalService = inject(NgbModal);
    readonly apiListService = inject(ApiListService);
    readonly chatService = inject(ChatService);

    readonly usersList = this.apiListService.usersList;
    readonly newUsers = this.apiListService.newUsers;
    readonly userOnlineList = this.chatService.usersOnlineList;

    readonly searchTerm = signal('');
    readonly roleFilter = signal('');
    readonly statusFilter = signal('');

    readonly userListFilter = computed<IUser[]>((): IUser[] => {
        let list = this.usersList();
        const search = this.searchTerm().toLowerCase();
        const role = this.roleFilter();
        const status = this.statusFilter();

        //this.countNewUsers();

        if (search) {
            list = list.filter(
                (u) =>
                    u.fullName?.toLowerCase().includes(search) ||
                    u.email?.toLowerCase().includes(search) ||
                    u.dni?.includes(search),
            );
        }

        if (role) {
            list = list.filter((u) => u.role === role);
        }

        if (status) {
            const isOnline = status === 'active';
            list = list.filter((u) => u.isOnline === isOnline);
        }

        return list.sort((a, b) => Number(b.isOnline) - Number(a.isOnline));
    });

    //abrir modal para crear, importar o editar usuario
    async formUser(mode: 'create' | 'edit' | 'import', data: IUser | null = null) {
        try {
            const ref = this.modalService.open(UsersFormComponent, {
                size: 'lg',
                backdrop: 'static',
            });
            const component: UsersFormComponent = ref.componentInstance;
            component.mode.set(mode);
            component.user.set(data);

            //if(mode === 'edit')
            const result: IUser | undefined = await ref.result;

            if (!result) return;

            mode == 'create' ? this.usersList.update((user) => [result, ...user]) : null;
            mode == 'edit'
                ? this.usersList.update((user) =>
                      user.map((u) => (u.id === result.id ? result : u)),
                  )
                : null;
        } catch (error) {
            console.log('error en el modal de usuarios: ', error);
        }
    }

    async eliminate(id: number) {
        const response = await this.apiUserService.delete(id);
        if (response.status == 'success')
            this.usersList.update((y) => y.filter((x) => x.id !== id));
    }
}
