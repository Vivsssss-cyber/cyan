import clsx from "clsx";
import svgPaths from "./svg-zghvtq7ef4";

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] relative w-full">{children}</div>
    </div>
  );
}

function BackgroundImage7({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Outfit:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#202326] text-[24px] tracking-[-0.288px] whitespace-nowrap">{children}</p>
    </div>
  );
}

function BackgroundImage6({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] flex-[1_0_0] h-[60px] min-h-px min-w-px relative rounded-[99px]">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">{children}</div>
      <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.6)]" />
      <div aria-hidden="true" className="absolute border-[#2ac2e4] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[99.5px] shadow-[0px_0px_2px_1px_rgba(0,0,0,0.04),0px_1px_0px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function BackgroundBorderShadowBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[rgba(255,255,255,0.6)] relative rounded-[16px] shrink-0 w-full">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[24px] relative w-full">{children}</div>
      </div>
      <div aria-hidden="true" className="absolute border-[1.416px] border-solid border-white inset-0 pointer-events-none rounded-[16px] shadow-[0px_2.509px_10.035px_0px_rgba(255,255,255,0)]" />
    </div>
  );
}

function ButtonBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <BackgroundImage6>
      <div className="content-stretch flex gap-[20px] items-center justify-center px-[16px] py-[15px] relative size-full">{children}</div>
    </BackgroundImage6>
  );
}

function BackgroundImage5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">{children}</g>
      </svg>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextBackgroundImageAndText({ text, additionalClassNames = "" }: TextBackgroundImageAndTextProps) {
  return (
    <div className={clsx("h-[18px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#757575] text-[12px] top-[-0.2px] whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type ButtonBackgroundImageAndTextProps = {
  text: string;
};

function ButtonBackgroundImageAndText({ text }: ButtonBackgroundImageAndTextProps) {
  return (
    <BackgroundImage6>
      <div className="content-stretch flex items-center justify-center px-[16px] py-[15px] relative size-full">
        <div className="flex flex-[1_0_0] flex-col font-['Outfit:Bold',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px relative text-[#020618] text-[20px] text-center tracking-[-0.2px]">
          <p className="leading-[normal]">{text}</p>
        </div>
      </div>
    </BackgroundImage6>
  );
}

function IconBackgroundImage1() {
  return (
    <BackgroundImage5>
      <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #020618)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage5>
  );
}

function IconBackgroundImage() {
  return (
    <BackgroundImage5>
      <path d="M12 10L8 6L4 10" id="Vector" stroke="var(--stroke-0, #020618)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </BackgroundImage5>
  );
}
type LabelBackgroundImageAndTextProps = {
  text: string;
};

function LabelBackgroundImageAndText({ text }: LabelBackgroundImageAndTextProps) {
  return <BackgroundImage7>{text}</BackgroundImage7>;
}

function BackgroundImage4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
    </div>
  );
}

function BackgroundImage3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
    </div>
  );
}

function BackgroundImage2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
    </div>
  );
}

function BackgroundImage1() {
  return (
    <div className="relative shrink-0 size-[63.136px]">
      <div aria-hidden="true" className="absolute border-[#232323] border-[0.631px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ additionalClassNames = "" }: BackgroundImageProps) {
  return (
    <div className={clsx("content-stretch flex items-center relative shrink-0", additionalClassNames)}>
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
      <BackgroundImage1 />
    </div>
  );
}

export default function SetUp() {
  return (
    <div className="bg-[#eff2f4] relative size-full" data-name="Set up 6">
      <div className="absolute bottom-0 h-[1223px] left-0 pointer-events-none top-0">
        <div className="h-[1034px] opacity-60 overflow-clip pointer-events-auto sticky top-0 w-[1512px]">
          <div className="-translate-x-1/2 absolute contents left-1/2 top-0" data-name="background texture">
            <div className="-translate-x-1/2 absolute content-stretch flex flex-col h-[1010px] items-start left-1/2 opacity-5 top-0 w-[1512px]" data-name="grid">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1512px]">
                <BackgroundImage additionalClassNames="w-[1515px]" />
                <BackgroundImage2 />
                <BackgroundImage3 />
                <BackgroundImage additionalClassNames="w-full" />
                <BackgroundImage2 />
                <BackgroundImage3 />
                <BackgroundImage3 />
                <BackgroundImage3 />
                <BackgroundImage3 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
                <BackgroundImage4 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute content-stretch flex h-[40px] items-center justify-between left-1/2 top-[32px] w-[1286px]">
        <div className="content-stretch flex items-center relative shrink-0">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-[32px]" data-name="shopping-shipping-shop">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <g id="Group">
                  <path d={svgPaths.p198f6b80} fill="var(--fill-0, #000001)" id="Vector" />
                  <path d={svgPaths.ped2e900} fill="var(--fill-0, #000001)" id="Vector_2" />
                  <path d={svgPaths.p1e193b00} fill="var(--fill-0, #000001)" id="Vector_3" />
                  <path d={svgPaths.p19f10980} fill="var(--fill-0, #000001)" id="Vector_4" />
                  <path d={svgPaths.p6604e70} fill="var(--fill-0, #000001)" id="Vector_5" />
                  <path d={svgPaths.p1a1f980} fill="var(--fill-0, #000001)" id="Vector_6" />
                  <path d={svgPaths.p77149f0} fill="var(--fill-0, #000001)" id="Vector_7" />
                  <path d={svgPaths.p10e28f00} fill="var(--fill-0, #000001)" id="Vector_8" />
                  <path d={svgPaths.p2b83b600} fill="var(--fill-0, #000001)" id="Vector_9" />
                  <path d={svgPaths.pc66300} fill="var(--fill-0, #000001)" id="Vector_10" />
                  <path d={svgPaths.p2c77300} fill="var(--fill-0, #000001)" id="Vector_11" />
                </g>
              </svg>
            </div>
            <p className="font-['Outfit:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#202326] text-[32px] tracking-[-0.32px] whitespace-nowrap">Startup Valley</p>
          </div>
        </div>
        <div className="content-stretch flex items-center relative shrink-0">
          <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
            <div className="bg-[#fafafa] content-stretch flex gap-[10px] items-center justify-center px-[14px] py-[8px] relative rounded-[99px] shadow-[0px_0px_0px_0px_#e1e4eb,0px_3px_8px_0px_rgba(0,0,0,0.06)] shrink-0" data-name="Background">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0f172b] text-[12px] whitespace-nowrap">
                <p className="leading-[16px]">Restaurant Owner</p>
              </div>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="multiple-user--Streamline-Pixel">
                <div className="absolute inset-[4.77%_0]" data-name="Group">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0002 14.475">
                    <g id="Group">
                      <path d={svgPaths.p2ce64f80} fill="var(--fill-0, #000001)" id="Vector" />
                      <path d={svgPaths.p2a8bfc00} fill="var(--fill-0, #000001)" id="Vector_2" />
                      <path d={svgPaths.p106cae80} fill="var(--fill-0, #000001)" id="Vector_3" />
                      <path d={svgPaths.p3cf6600} fill="var(--fill-0, #000001)" id="Vector_4" />
                      <path d={svgPaths.p280ecd00} fill="var(--fill-0, #000001)" id="Vector_5" />
                      <path d={svgPaths.p22186080} fill="var(--fill-0, #000001)" id="Vector_6" />
                      <path d={svgPaths.p33a42380} fill="var(--fill-0, #000001)" id="Vector_7" />
                      <path d={svgPaths.p38377f00} fill="var(--fill-0, #000001)" id="Vector_8" />
                      <path d={svgPaths.p3c5ea100} fill="var(--fill-0, #000001)" id="Vector_9" />
                      <path d={svgPaths.p304fbd70} fill="var(--fill-0, #000001)" id="Vector_10" />
                      <path d={svgPaths.p298be500} fill="var(--fill-0, #000001)" id="Vector_11" />
                      <path d={svgPaths.p2c737700} fill="var(--fill-0, #000001)" id="Vector_12" />
                      <path d={svgPaths.p6cb6b00} fill="var(--fill-0, #000001)" id="Vector_13" />
                      <path d={svgPaths.p2051d720} fill="var(--fill-0, #000001)" id="Vector_14" />
                      <path d={svgPaths.p12900d00} fill="var(--fill-0, #000001)" id="Vector_15" />
                      <path d={svgPaths.p20bc900} fill="var(--fill-0, #000001)" id="Vector_16" />
                      <path d={svgPaths.p8fee900} fill="var(--fill-0, #000001)" id="Vector_17" />
                      <path d={svgPaths.p330b5d92} fill="var(--fill-0, #000001)" id="Vector_18" />
                      <path d={svgPaths.p99f1000} fill="var(--fill-0, #000001)" id="Vector_19" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_0px_0px_white]" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-[112px] top-[112px] w-[1280px]">
        <p className="font-['Outfit:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#202326] text-[32px] tracking-[-0.32px] w-full">Your weekly Operations</p>
        <div className="content-stretch flex gap-[36px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[749px]">
            <BackgroundBorderShadowBackgroundImage>
              <div className="h-[6px] shrink-0 w-full" data-name="Rectangle" />
              <ContainerBackgroundImage>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[560px]" data-name="Container">
                    <LabelBackgroundImageAndText text="Cost of Marketing (Weekly Budget)" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="HorizontalBorder">
                  <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex items-start relative shrink-0 w-full">
                      <ButtonBackgroundImage>
                        <div className="flex flex-[1_0_0] flex-col font-['Outfit:Bold',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px relative text-[#020618] text-[20px] text-center tracking-[-0.2px]">
                          <p className="leading-[normal]">$ 20,000</p>
                        </div>
                        <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start justify-center relative shrink-0 w-[24px]" data-name="Container">
                          <IconBackgroundImage />
                          <IconBackgroundImage1 />
                        </div>
                      </ButtonBackgroundImage>
                    </div>
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#62748e] text-[14px] text-center whitespace-nowrap">
                      <p className="leading-[normal]">Once submitted, you cannot change your decision for this round.</p>
                    </div>
                  </div>
                </div>
              </ContainerBackgroundImage>
            </BackgroundBorderShadowBackgroundImage>
            <BackgroundBorderShadowBackgroundImage>
              <div className="h-[6px] shrink-0 w-full" data-name="Rectangle" />
              <ContainerBackgroundImage>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[560px]" data-name="Container">
                    <BackgroundImage7>{`Discount & Promotion Level`}</BackgroundImage7>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="HorizontalBorder">
                  <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex items-start relative shrink-0 w-full">
                      <ButtonBackgroundImage>
                        <div className="flex flex-[1_0_0] flex-col font-['Outfit:Bold',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px relative text-[#020618] text-[20px] text-center tracking-[-0.2px]">
                          <p className="leading-[normal]">5%</p>
                        </div>
                        <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start justify-center relative shrink-0 w-[24px]" data-name="Container">
                          <IconBackgroundImage />
                          <IconBackgroundImage1 />
                        </div>
                      </ButtonBackgroundImage>
                    </div>
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#62748e] text-[14px] text-center whitespace-nowrap">
                      <p className="leading-[normal]">Once submitted, you cannot change your decision for this round.</p>
                    </div>
                  </div>
                </div>
              </ContainerBackgroundImage>
            </BackgroundBorderShadowBackgroundImage>
            <BackgroundBorderShadowBackgroundImage>
              <div className="h-[6px] shrink-0 w-full" data-name="Rectangle" />
              <ContainerBackgroundImage>
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[560px]" data-name="Container">
                    <LabelBackgroundImageAndText text="Average Price per product" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="HorizontalBorder">
                  <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                    <div className="content-stretch flex items-start relative shrink-0 w-full">
                      <ButtonBackgroundImage>
                        <div className="flex flex-[1_0_0] flex-col font-['Outfit:Bold',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px relative text-[#020618] text-[20px] text-center tracking-[-0.2px]">
                          <p className="leading-[normal]">20</p>
                        </div>
                        <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start justify-center relative shrink-0 w-[24px]" data-name="Container">
                          <IconBackgroundImage />
                          <IconBackgroundImage1 />
                        </div>
                      </ButtonBackgroundImage>
                    </div>
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#62748e] text-[14px] text-center whitespace-nowrap">
                      <p className="leading-[normal]">Once submitted, you cannot change your decision for this round.</p>
                    </div>
                  </div>
                </div>
              </ContainerBackgroundImage>
            </BackgroundBorderShadowBackgroundImage>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[495px]">
            <BackgroundBorderShadowBackgroundImage>
              <div className="h-[6px] shrink-0 w-full" data-name="Rectangle" />
              <div className="relative shrink-0 w-full" data-name="Container">
                <div className="content-stretch flex flex-col gap-[27px] items-start px-[24px] relative w-full">
                  <p className="font-['Outfit:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#202326] text-[24px] tracking-[-0.288px] whitespace-nowrap">Estimates</p>
                  <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
                      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[18px] text-center whitespace-nowrap">
                        <p className="leading-[normal]">Estimated Customers Regular</p>
                      </div>
                      <div className="content-stretch flex items-start relative shrink-0 w-[126px]">
                        <ButtonBackgroundImageAndText text="500" />
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
                      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#374151] text-[18px] text-center whitespace-nowrap">
                        <p className="leading-[normal]">Estimated Customers Preminum</p>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative">
                        <ButtonBackgroundImageAndText text="500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BackgroundBorderShadowBackgroundImage>
            <div className="bg-[rgba(255,255,255,0.6)] h-[186px] relative rounded-[15.053px] shrink-0 w-full" data-name="MarketRules">
              <div aria-hidden="true" className="absolute border-[1.416px] border-solid border-white inset-0 pointer-events-none rounded-[15.053px] shadow-[0px_2.509px_10.035px_0px_rgba(255,255,255,0)]" />
              <div className="flex flex-col items-center size-full">
                <div className="content-stretch flex flex-col gap-[10px] items-center p-[25px] relative size-full">
                  <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
                    <p className="font-['Outfit:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#212121] text-[16px] whitespace-nowrap">Notes:</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] h-[96px] items-start relative shrink-0 w-full" data-name="List">
                    <div className="content-stretch flex gap-[8px] h-[18px] items-start relative shrink-0 w-full" data-name="List Item">
                      <TextBackgroundImageAndText text="•" additionalClassNames="w-[6.75px]" />
                      <TextBackgroundImageAndText text="This is a weekly decision" additionalClassNames="w-[182.5px]" />
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[18px] items-start relative shrink-0 w-full" data-name="List Item">
                      <TextBackgroundImageAndText text="•" additionalClassNames="w-[6.75px]" />
                      <TextBackgroundImageAndText text="This is a one time decisions" additionalClassNames="w-[169.463px]" />
                    </div>
                    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] h-[18px] items-start leading-[18px] not-italic relative shrink-0 text-[#757575] text-[12px] w-full whitespace-nowrap" data-name="List Item">
                      <p className="relative shrink-0">•</p>
                      <p className="relative shrink-0">Marketplace fee: 2%</p>
                    </div>
                    <div className="content-stretch flex gap-[8px] h-[18px] items-start relative shrink-0 w-full" data-name="List Item">
                      <TextBackgroundImageAndText text="•" additionalClassNames="w-[6.75px]" />
                      <TextBackgroundImageAndText text="Bids are binding" additionalClassNames="w-[91.3px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="relative rounded-[46px] shrink-0 w-full" data-name="Primary" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 495 56\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.0000034468 8 -70.108 -4.2396 247.5 -21)\\'><stop stop-color=\\'rgba(0,95,88,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(0,60,73,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }}>
                <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative w-full">
                    <p className="font-['Outfit:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[16px] text-white whitespace-nowrap">Set the Count</p>
                    <div className="bg-[rgba(255,255,255,0.2)] overflow-clip relative rounded-[60px] shrink-0 size-[32px]">
                      <div className="absolute left-[6px] size-[20px] top-[6px]" data-name="arrow-left-02">
                        <div className="absolute flex inset-[17.14%_17.15%_17.15%_17.15%] items-center justify-center">
                          <div className="flex-none h-[8.333px] rotate-135 w-[10.251px]">
                            <div className="relative size-full">
                              <div className="absolute inset-[-7.5%_-6.1%]">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5013 9.58342">
                                  <g id="Group 1707482490">
                                    <path d={svgPaths.p1501e100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                                    <path d={svgPaths.p3f8c3540} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-[-1px] pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_8px_1px_rgba(20,20,20,0.5)]" />
                <div aria-hidden="true" className="absolute border border-[#0e3a3e] border-solid inset-[-1px] pointer-events-none rounded-[47px]" />
              </div>
              <div className="h-[50px] relative rounded-[41px] shrink-0 w-full" data-name="Button">
                <div aria-hidden="true" className="absolute border-[#717171] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[41px]" />
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[16.8px] py-[8.8px] relative size-full">
                    <p className="font-['Outfit:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#212121] text-[14px] whitespace-nowrap">Cancel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}