// SVGR: *.svg imports are inline React components. Use *.svg?url for a URL string.
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}
