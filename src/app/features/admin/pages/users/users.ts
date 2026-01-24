import { Component, ChangeDetectionStrategy, signal, inject } from "@angular/core";
import { apiUserService } from "./apiUser.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersFormComponent } from "./usersFormAdmin/userFormAdmin";

@Component({
    selector: 'app-users',
    templateUrl: './users.html',
    styleUrl: './users.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
    readonly apiUserService = inject(apiUserService)
    readonly modalService = inject(NgbModal)

    readonly usersList = signal<IUser[]>([])

    constructor(){
        this.getList()
    }

    //Obtiene la lista de usuarios con el backent
    async getList(){
        const response = await this.apiUserService.list()
        if(response.length == 0) return
        this.usersList.set(response)
    }

    //abrir modal para crear, importar o editar usuario
    async formUser(mode: 'create' | 'edit' | 'import', data: IUser | null = null){
        const ref = this.modalService.open(UsersFormComponent, {
            size: 'lg',
            backdrop: 'static'
        })
        const component: UsersFormComponent = ref.componentInstance
        component.mode.set(mode)
        //if(mode === 'edit')
        const result: IUser | null = await ref.result
    }
    
}