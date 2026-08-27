import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v14H4z" />
      <path d="M4 6l8 7 8-7" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CountertopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8h18v3H3z" />
      <path d="M5 11v9M19 11v9M9 11v9M9 11h6" />
    </svg>
  );
}

export function PotIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10h16l-1.4 8.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 10z" />
      <path d="M2 7h20M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 10V8M18 10V8" />
    </svg>
  );
}

export function BathIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2z" />
      <path d="M5 12V6a2 2 0 0 1 3.2-1.6M7 19v2M17 19v2" />
    </svg>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.6-2.5h4.8L16 7" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.3-3.6A7.9 7.9 0 0 1 4 12z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10.5 9.3v5.4l4.5-2.7z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MusicNoteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18V5.5L20 4v12.5" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16.5" r="2.5" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.6L3 29l7.2-2.1c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.5S23 3 16 3zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.3 1.2 1.2-4.2-.3-.4a10.3 10.3 0 0 1-1.6-5.6C5.2 9.7 10 4.8 16 4.8s10.8 4.9 10.8 10.7S22 25.7 16 25.7zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.3 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4z" />
    </svg>
  );
}
