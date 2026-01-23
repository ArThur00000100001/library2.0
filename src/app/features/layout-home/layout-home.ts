import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.html',
  styleUrl: './layout-home.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class LayoutHomeComponent {
  isOpen = signal(true);

  toggleSidebar() {
    this.isOpen.update(value => !value);
  }
}
