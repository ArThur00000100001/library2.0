import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/guard/auth.service';
import { ChatService } from '../services/chat/chat.service';
import { ChatComponent } from '../chat/chat';

@Component({
    selector: 'app-layout-home',
    templateUrl: './layout-home.html',
    styleUrl: './layout-home.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatComponent],
})
export class LayoutHomeComponent {
    readonly chatServie = inject(ChatService);
    readonly authService = inject(AuthService);
    readonly user = this.authService.user();

    isOpen = signal(true);

    toggleSidebar() {
        this.isOpen.update((value) => !value);
    }

    logout() {
        this.authService.logout();
        this.chatServie.socket?.disconnect();
    }
}
