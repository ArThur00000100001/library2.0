import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/guard/auth.service";

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.html',
  styleUrl: './layout-home.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class LayoutHomeComponent {
  readonly authService = inject(AuthService)
  readonly user = this.authService.user()

  isOpen = signal(true);

  toggleSidebar() {
    this.isOpen.update(value => !value);
  }

  logout(){
    this.authService.logout()
  }
}
