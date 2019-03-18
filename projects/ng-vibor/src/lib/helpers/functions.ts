
export function IsNumber(n: any): boolean {
    return !isNaN(n) && n !== undefined && n !== null;
}

export function fetchFromObject(object: any, prop: string): any {
    if (typeof object === 'undefined') {
        return false;
    }
    if (typeof object === 'string') {
        return object;
    }

    const index: number = prop.indexOf('.');
    if (index > -1) {
        return fetchFromObject(object[prop.substring(0, index)], prop.substr(index + 1));
    }

    return object[prop];
}

function getWindow(elem: any): any {
    return elem != null && elem === elem.window ? elem : elem.nodeType === 9 && elem.defaultView;
}

function getOffset(elem: HTMLElement): any {
    let docElem: HTMLElement;
    let win: Window;
    const box: any = elem.getBoundingClientRect();
    const doc = elem && elem.ownerDocument;

    if (!doc) {
      return;
    }

    docElem = doc.documentElement;
    win = getWindow(doc);

    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  }

export function scrollActiveOption(list: HTMLElement, item: HTMLElement, height_item: number): void {
    let y: any, height_menu: any, scroll: any, scroll_top: any, scroll_bottom: any;

    if (item) {
      height_menu = list.offsetHeight;
      scroll = list.scrollTop || 0;
      y = getOffset(item).top - getOffset(list).top + scroll;
      scroll_top = y;
      scroll_bottom = y - height_menu + height_item;

      // TODO Make animation
      if (y + height_item > height_menu + scroll) {
        list.scrollTop = scroll_bottom;
      } else if (y < scroll) {
        list.scrollTop = scroll_top;
      }
    }
  }
