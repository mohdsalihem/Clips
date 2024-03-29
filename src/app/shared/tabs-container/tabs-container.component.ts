import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styles: [],
  standalone: true,
  imports: [NgFor, NgClass],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active);

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach((tab) => (tab.active = false));

    tab.active = true;
  }
}
