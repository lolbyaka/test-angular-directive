import {
  Directive,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  Input,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { IConfig } from "../interfaces/only-for-screen.interface";
import { windowResizeObservable } from "../utils";

@Directive({
  selector: "[onlyForScreen]",
})
export class OnlyForScreenDirective implements OnInit, OnDestroy {
  @Input() onlyForScreen: string;
  screenType$: Observable<string>;
  screenTypeSubscription: Subscription;
  visible: boolean = false;

  config: IConfig = {
    mobile: 480,
    tablet: 1024,
  };

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.screenType$ = windowResizeObservable().pipe(
      map((screenWidth: number) => {
        let currentScreenSize = "none";

        if (this.config.mobile > screenWidth) {
          currentScreenSize = "mobile";
        } else if (
          this.config.mobile <= screenWidth &&
          this.config.tablet >= screenWidth
        ) {
          currentScreenSize = "tablet";
        } else if (this.config.tablet <= screenWidth) {
          currentScreenSize = "desktop";
        }
        return currentScreenSize;
      })
    );

    this.screenTypeSubscription = this.screenType$
      .pipe(
        map((mode) => {
          if (this.onlyForScreen === mode && !this.visible) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.visible = !this.visible;
          } else if (this.onlyForScreen !== mode && this.visible) {
            this.visible = !this.visible;
            this.viewContainer.clear();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.screenTypeSubscription) this.screenTypeSubscription.unsubscribe();
  }
}
