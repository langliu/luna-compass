export interface PortalProps {
  children: React.ReactNode
  /**
   * @description 挂载的容器（默认为`document.body`）
   */
  container: HTMLElement | null
}
