import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { apiUserService } from './apiUser.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersFormComponent } from './usersFormAdmin/userFormAdmin';
import { IUser } from '../../models/types';

@Component({
    selector: 'app-users',
    templateUrl: './users.html',
    styleUrl: './users.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
    readonly apiUserService = inject(apiUserService);
    readonly modalService = inject(NgbModal);

    readonly usersList = signal<IUser[]>([]);
    readonly newsUser = computed(() => {
        const users = this.usersList();
        return '0';
    });

    constructor() {
        this.getList();
    }

    //Obtiene la lista de usuarios con el backent
    async getList() {
        const response = await this.apiUserService.list();
        if (response.length == 0) return;
        this.usersList.set(response);
    }

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
