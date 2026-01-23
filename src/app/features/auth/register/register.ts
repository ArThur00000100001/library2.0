import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
}
