'use client';

import React from 'react';

// Streamline Pixel icons as inline React components (SVGR — see next.config.ts).
// Inline <svg> is the one icon form Figma html-to-design captures as editable
// vectors. SVGO has rewritten the fills to `currentColor`, so `color` recolors
// them. No CSS mask, no runtime fetch, no capture-mode swap needed.
import activity from './icons/business-products-data-file-bars--Streamline-Pixel.svg';
import alertCircle from './icons/interface-essential-alert-circle-1--Streamline-Pixel.svg';
import alertTriangle from './icons/interface-essential-alert-triangle-1--Streamline-Pixel.svg';
import arrowDownRight from './icons/business-products-performance-money-decrease--Streamline-Pixel.svg';
import arrowUpRight from './icons/business-products-climb-top--Streamline-Pixel.svg';
import award from './icons/social-rewards-certified-ribbon--Streamline-Pixel.svg';
import barChart from './icons/business-products-data-file-bars--Streamline-Pixel.svg';
import battery from './icons/interface-essential-battery--Streamline-Pixel.svg';
import bell from './icons/interface-essential-alarm-bell-sleep--Streamline-Pixel.svg';
import box from './icons/shopping-shipping-box--Streamline-Pixel.svg';
import calendar from './icons/interface-essential-calendar-date--Streamline-Pixel.svg';
import check from './icons/business-product-check--Streamline-Pixel.svg';
import chevron from './icons/interface-essential-keyboard-button-direction-1--Streamline-Pixel.svg';
import clock from './icons/interface-essential-clock--Streamline-Pixel.svg';
import cloud from './icons/weather-cloud-sun-fine--Streamline-Pixel.svg';
import code from './icons/coding-apps-websites-programming-browser--Streamline-Pixel.svg';
import coffee from './icons/food-drink-coffee-cup--Streamline-Pixel.svg';
import copy from './icons/content-files-note--Streamline-Pixel.svg';
import cpu from './icons/computers-devices-electronics-chipset--Streamline-Pixel.svg';
import dollar from './icons/money-payments-cash-payment-coin--Streamline-Pixel.svg';
import download from './icons/internet-network-download--Streamline-Pixel.svg';
import droplets from './icons/weather-rainbow--Streamline-Pixel.svg';
import edit from './icons/interface-essential-edit-fill--Streamline-Pixel.svg';
import externalLink from './icons/interface-essential-hyperlink--Streamline-Pixel.svg';
import eye from './icons/interface-essential-view-eye--Streamline-Pixel.svg';
import eyeOff from './icons/interface-essential-view-eye--Streamline-Pixel.svg';
import file from './icons/content-files-note--Streamline-Pixel.svg';
import globe from './icons/interface-essential-global-public--Streamline-Pixel.svg';
import heart from './icons/interface-essential-heart-favorite--Streamline-Pixel.svg';
import home from './icons/interface-essential-home-1--Streamline-Pixel.svg';
import info from './icons/interface-essential-information-circle-1--Streamline-Pixel.svg';
import landmark from './icons/money-payments-bank--Streamline-Pixel.svg';
import layers from './icons/design-layer--Streamline-Pixel.svg';
import layoutGrid from './icons/design-artboard-shapes--Streamline-Pixel.svg';
import lightbulb from './icons/interface-essential-light-bulb--Streamline-Pixel.svg';
import lock from './icons/interface-essential-lock--Streamline-Pixel.svg';
import mail from './icons/email-envelope--Streamline-Pixel.svg';
import map from './icons/map-navigation-compass-direction--Streamline-Pixel.svg';
import menu from './icons/interface-essential-list--Streamline-Pixel.svg';
import minus from './icons/interface-essential-search-remove--Streamline-Pixel.svg';
import monitor from './icons/computers-devices-electronics-monitor--Streamline-Pixel.svg';
import packageIcon from './icons/shopping-shipping-loading-box--Streamline-Pixel.svg';
import palette from './icons/design-color-painting-palette--Streamline-Pixel.svg';
import phone from './icons/phone-incoming-call--Streamline-Pixel.svg';
import pieChart from './icons/interface-essential-pie-chart-poll-report-1--Streamline-Pixel.svg';
import play from './icons/video-movies-play--Streamline-Pixel.svg';
import plus from './icons/email-mail-open-address--Streamline-Pixel.svg';
import refresh from './icons/interface-essential-synchronize-arrows-square-1--Streamline-Pixel.svg';
import rotate from './icons/internet-network-arrow-sync--Streamline-Pixel.svg';
import search from './icons/interface-essential-search-1--Streamline-Pixel.svg';
import settings from './icons/interface-essential-cog-double--Streamline-Pixel.svg';
import share from './icons/interface-essential-share-1--Streamline-Pixel.svg';
import shoppingCart from './icons/shopping-shipping-cart--Streamline-Pixel.svg';
import sliders from './icons/interface-essential-setting-slide--Streamline-Pixel.svg';
import smartphone from './icons/mobile-phone--Streamline-Pixel.svg';
import star from './icons/social-rewards-rating-star-1--Streamline-Pixel.svg';
import sun from './icons/weather-cloud-sun-fine--Streamline-Pixel.svg';
import tablet from './icons/computers-devices-electronics-tablet--Streamline-Pixel.svg';
import thumbsUp from './icons/social-rewards-like-circle--Streamline-Pixel.svg';
import trash from './icons/interface-essential-bin--Streamline-Pixel.svg';
import trendingDown from './icons/business-products-performance-money-decrease--Streamline-Pixel.svg';
import trendingUp from './icons/business-products-performance-money-increase--Streamline-Pixel.svg';
import truck from './icons/shopping-shipping-delivery-truck--Streamline-Pixel.svg';
import typeIcon from './icons/interface-essential-find-text--Streamline-Pixel.svg';
import unlock from './icons/interface-essential-lock-door-out--Streamline-Pixel.svg';
import upload from './icons/internet-network-upload--Streamline-Pixel.svg';
import userPlus from './icons/search-user--Streamline-Pixel.svg';
import users from './icons/multiple-user--Streamline-Pixel.svg';
import wifi from './icons/interface-essential-wifi-signal--Streamline-Pixel.svg';
import wind from './icons/weather-wind-flag--Streamline-Pixel.svg';
import x from './icons/interface-essential-search-remove--Streamline-Pixel.svg';
import zap from './icons/interface-essential-flash--Streamline-Pixel.svg';
import crown from './icons/social-rewards-vip-crown-king--Streamline-Pixel.svg';
import trophy from './icons/interface-essential-trophy--Streamline-Pixel.svg';
import stopwatch from './icons/interface-essential-stopwatch--Streamline-Pixel.svg';
import wallet from './icons/business-products-wallet-money--Streamline-Pixel.svg';
import milk from './icons/food-drink-milk--Streamline-Pixel.svg';
import cake from './icons/food-drink-desert-cake--Streamline-Pixel.svg';
import bread from './icons/food-drink-bread--Streamline-Pixel.svg';
import coffeeBeans from './icons/food-drink-coffee--Streamline-Pixel.svg';
import salad from './icons/beauty-healthy-food-dish--Streamline-Pixel.svg';
import tea from './icons/food-drink-tea--Streamline-Pixel.svg';
import egg from './icons/food-drink-egg--Streamline-Pixel.svg';
import hamburger from './icons/food-drink-hamburger--Streamline-Pixel.svg';
import scale from './icons/business-product-scale--Streamline-Pixel.svg';
import diamond from './icons/money-payments-diamond--Streamline-Pixel.svg';
import megaphone from './icons/interface-essential-speaker-announce--Streamline-Pixel.svg';
import flask from './icons/school-science-test-flask--Streamline-Pixel.svg';
import shoppingBag from './icons/shopping-shipping-bag-1--Streamline-Pixel.svg';
import sparkle from './icons/photography-retouch-wand-star--Streamline-Pixel.svg';
import target from './icons/business-product-target--Streamline-Pixel.svg';
import receipt from './icons/shopping-shipping-receipt-slip--Streamline-Pixel.svg';
import cupcake from './icons/food-drink-desert-cupcake--Streamline-Pixel.svg';
import microphone from './icons/interface-essential-microphone--Streamline-Pixel.svg';
import message from './icons/interface-essential-message--Streamline-Pixel.svg';
import sendMail from './icons/interface-essential-send-mail--Streamline-Pixel.svg';
import questionHelp from './icons/interface-essential-question-help-circle-1--Streamline-Pixel.svg';
import pencil from './icons/interface-essential-pencil-edit-1--Streamline-Pixel.svg';
import flag from './icons/interface-essential-flag--Streamline-Pixel.svg';
import graduationCap from './icons/school-science-graduation-cap--Streamline-Pixel.svg';
import openBook from './icons/content-files-open-book--Streamline-Pixel.svg';
import folderOpen from './icons/content-files-folder-open--Streamline-Pixel.svg';
import stopSign from './icons/interface-essential-stop-sign-1--Streamline-Pixel.svg';
import history from './icons/interface-essential-waiting-hourglass-loading--Streamline-Pixel.svg';

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;

export type PixelIconProps = Omit<React.SVGProps<SVGSVGElement>, 'color' | 'ref'> & {
  size?: number;
  color?: string;
  title?: string;
};

function makeIcon(Icon: SvgComponent, rotation = 0) {
  return function StreamlinePixelIcon({
    size = 20,
    color = 'currentColor',
    className,
    title,
    style,
    ...props
  }: PixelIconProps) {
    return (
      <Icon
        width={size}
        height={size}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        role={title ? 'img' : undefined}
        className={className}
        style={{
          display: 'inline-block',
          flexShrink: 0,
          color,
          ...style,
          transform: rotation ? `rotate(${rotation}deg)` : style?.transform,
        }}
        {...props}
      />
    );
  };
}

export const Activity = makeIcon(activity);
export const AlertCircle = makeIcon(alertCircle);
export const AlertTriangle = makeIcon(alertTriangle);
export const ArrowDownRight = makeIcon(arrowDownRight);
export const ArrowUpRight = makeIcon(arrowUpRight);
export const Award = makeIcon(award);
export const BarChart2 = makeIcon(barChart);
export const BarChart3 = makeIcon(barChart);
export const Battery = makeIcon(battery);
export const Bell = makeIcon(bell);
export const Box = makeIcon(box);
export const Calendar = makeIcon(calendar);
export const Check = makeIcon(check);
export const ChevronDown = makeIcon(chevron, 90);
export const ChevronLeft = makeIcon(chevron, 180);
export const ChevronRight = makeIcon(chevron);
export const ChevronUp = makeIcon(chevron, -90);
export const Clock = makeIcon(clock);
export const Cloud = makeIcon(cloud);
export const Code2 = makeIcon(code);
export const Coffee = makeIcon(coffee);
export const Copy = makeIcon(copy);
export const Cpu = makeIcon(cpu);
export const DollarSign = makeIcon(dollar);
export const Download = makeIcon(download);
export const Droplets = makeIcon(droplets);
export const Edit2 = makeIcon(edit);
export const ExternalLink = makeIcon(externalLink);
export const Eye = makeIcon(eye);
export const EyeOff = makeIcon(eyeOff);
export const FileText = makeIcon(file);
export const Globe = makeIcon(globe);
export const Heart = makeIcon(heart);
export const Home = makeIcon(home);
export const Info = makeIcon(info);
export const Landmark = makeIcon(landmark);
export const Layers = makeIcon(layers);
export const LayoutGrid = makeIcon(layoutGrid);
export const Lightbulb = makeIcon(lightbulb);
export const Lock = makeIcon(lock);
export const Mail = makeIcon(mail);
export const Map = makeIcon(map);
export const Menu = makeIcon(menu);
export const Minus = makeIcon(minus);
export const Monitor = makeIcon(monitor);
export const Package = makeIcon(packageIcon);
export const Palette = makeIcon(palette);
export const Phone = makeIcon(phone);
export const PieChart = makeIcon(pieChart);
export const Play = makeIcon(play);
export const Plus = makeIcon(plus);
export const RefreshCw = makeIcon(refresh);
export const RotateCcw = makeIcon(rotate);
export const Search = makeIcon(search);
export const Settings = makeIcon(settings);
export const Share2 = makeIcon(share);
export const ShoppingCart = makeIcon(shoppingCart);
export const Sliders = makeIcon(sliders);
export const Smartphone = makeIcon(smartphone);
export const Star = makeIcon(star);
export const Sun = makeIcon(sun);
export const Tablet = makeIcon(tablet);
export const ThumbsUp = makeIcon(thumbsUp);
export const Trash2 = makeIcon(trash);
export const TrendingDown = makeIcon(trendingDown);
export const TrendingUp = makeIcon(trendingUp);
export const Truck = makeIcon(truck);
export const Type = makeIcon(typeIcon);
export const Unlock = makeIcon(unlock);
export const Upload = makeIcon(upload);
export const UserPlus = makeIcon(userPlus);
export const Users = makeIcon(users);
export const Wifi = makeIcon(wifi);
export const Wind = makeIcon(wind);
export const X = makeIcon(x);
export const Zap = makeIcon(zap);
export const Crown = makeIcon(crown);
export const Trophy = makeIcon(trophy);
export const Stopwatch = makeIcon(stopwatch);
export const Wallet = makeIcon(wallet);
export const Milk = makeIcon(milk);
export const Cake = makeIcon(cake);
export const Bread = makeIcon(bread);
export const CoffeeBeans = makeIcon(coffeeBeans);
export const Salad = makeIcon(salad);
export const Tea = makeIcon(tea);
export const Egg = makeIcon(egg);
export const Hamburger = makeIcon(hamburger);
export const Scale = makeIcon(scale);
export const Diamond = makeIcon(diamond);
export const Megaphone = makeIcon(megaphone);
export const Flask = makeIcon(flask);
export const ShoppingBag = makeIcon(shoppingBag);
export const Sparkle = makeIcon(sparkle);
export const Target = makeIcon(target);
export const Receipt = makeIcon(receipt);
export const Cupcake = makeIcon(cupcake);
export const Mic = makeIcon(microphone);
export const MessageSquare = makeIcon(message);
export const Send = makeIcon(sendMail);
export const HelpCircle = makeIcon(questionHelp);
export const Pencil = makeIcon(pencil);
export const Flag = makeIcon(flag);
export const GraduationCap = makeIcon(graduationCap);
export const BookOpen = makeIcon(openBook);
export const FolderOpen = makeIcon(folderOpen);
export const StopSign = makeIcon(stopSign);
export const History = makeIcon(history);
