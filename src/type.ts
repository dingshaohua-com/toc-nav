export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface Config {
  contentElement: HTMLElement | Document;
  tocElement: HTMLElement;
  useHash: boolean;
}
