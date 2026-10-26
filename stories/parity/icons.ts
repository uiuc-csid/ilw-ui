// Every icon name in the toolkit's ilw-icon font (from the brand icon API) and
// the Phosphor icon that replaces it: the migration table the README points to.
// Most are a close match; where Phosphor has no counterpart (Bluesky, Substack,
// Weibo, Yelp, Flickr, Google+, campus-specific glyphs) it is the nearest idea.

import type { Component } from 'svelte';
import type { IconComponentProps } from 'phosphor-svelte';

import AddressBook from 'phosphor-svelte/lib/AddressBook';
import ArrowDown from 'phosphor-svelte/lib/ArrowDown';
import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft';
import ArrowUp from 'phosphor-svelte/lib/ArrowUp';
import Article from 'phosphor-svelte/lib/Article';
import Bell from 'phosphor-svelte/lib/Bell';
import Book from 'phosphor-svelte/lib/Book';
import BookOpen from 'phosphor-svelte/lib/BookOpen';
import Briefcase from 'phosphor-svelte/lib/Briefcase';
import Browser from 'phosphor-svelte/lib/Browser';
import Buildings from 'phosphor-svelte/lib/Buildings';
import Butterfly from 'phosphor-svelte/lib/Butterfly';
import Calendar from 'phosphor-svelte/lib/Calendar';
import CalendarStar from 'phosphor-svelte/lib/CalendarStar';
import CaretDown from 'phosphor-svelte/lib/CaretDown';
import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
import CaretRight from 'phosphor-svelte/lib/CaretRight';
import CaretUp from 'phosphor-svelte/lib/CaretUp';
import Certificate from 'phosphor-svelte/lib/Certificate';
import Chalkboard from 'phosphor-svelte/lib/Chalkboard';
import ChalkboardTeacher from 'phosphor-svelte/lib/ChalkboardTeacher';
import ChatCircle from 'phosphor-svelte/lib/ChatCircle';
import ChatsCircle from 'phosphor-svelte/lib/ChatsCircle';
import Check from 'phosphor-svelte/lib/Check';
import Clock from 'phosphor-svelte/lib/Clock';
import ClockCountdown from 'phosphor-svelte/lib/ClockCountdown';
import CreditCard from 'phosphor-svelte/lib/CreditCard';
import CurrencyDollar from 'phosphor-svelte/lib/CurrencyDollar';
import DeviceMobile from 'phosphor-svelte/lib/DeviceMobile';
import DownloadSimple from 'phosphor-svelte/lib/DownloadSimple';
import Envelope from 'phosphor-svelte/lib/Envelope';
import Exam from 'phosphor-svelte/lib/Exam';
import FacebookLogo from 'phosphor-svelte/lib/FacebookLogo';
import File from 'phosphor-svelte/lib/File';
import FilePdf from 'phosphor-svelte/lib/FilePdf';
import Flask from 'phosphor-svelte/lib/Flask';
import Funnel from 'phosphor-svelte/lib/Funnel';
import Gear from 'phosphor-svelte/lib/Gear';
import Gift from 'phosphor-svelte/lib/Gift';
import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
import Globe from 'phosphor-svelte/lib/Globe';
import GoogleLogo from 'phosphor-svelte/lib/GoogleLogo';
import GraduationCap from 'phosphor-svelte/lib/GraduationCap';
import HandCoins from 'phosphor-svelte/lib/HandCoins';
import HandHeart from 'phosphor-svelte/lib/HandHeart';
import Handshake from 'phosphor-svelte/lib/Handshake';
import Heart from 'phosphor-svelte/lib/Heart';
import House from 'phosphor-svelte/lib/House';
import IdentificationBadge from 'phosphor-svelte/lib/IdentificationBadge';
import Image from 'phosphor-svelte/lib/Image';
import ImagesSquare from 'phosphor-svelte/lib/ImagesSquare';
import Info from 'phosphor-svelte/lib/Info';
import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo';
import Laptop from 'phosphor-svelte/lib/Laptop';
import Link from 'phosphor-svelte/lib/Link';
import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo';
import List from 'phosphor-svelte/lib/List';
import ListChecks from 'phosphor-svelte/lib/ListChecks';
import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
import MapPin from 'phosphor-svelte/lib/MapPin';
import MastodonLogo from 'phosphor-svelte/lib/MastodonLogo';
import Microphone from 'phosphor-svelte/lib/Microphone';
import Minus from 'phosphor-svelte/lib/Minus';
import Newspaper from 'phosphor-svelte/lib/Newspaper';
import PaperPlaneRight from 'phosphor-svelte/lib/PaperPlaneRight';
import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt';
import Pause from 'phosphor-svelte/lib/Pause';
import PencilSimpleLine from 'phosphor-svelte/lib/PencilSimpleLine';
import Phone from 'phosphor-svelte/lib/Phone';
import PinterestLogo from 'phosphor-svelte/lib/PinterestLogo';
import Play from 'phosphor-svelte/lib/Play';
import Plus from 'phosphor-svelte/lib/Plus';
import Question from 'phosphor-svelte/lib/Question';
import Receipt from 'phosphor-svelte/lib/Receipt';
import RedditLogo from 'phosphor-svelte/lib/RedditLogo';
import Rss from 'phosphor-svelte/lib/Rss';
import ShieldCheck from 'phosphor-svelte/lib/ShieldCheck';
import SignOut from 'phosphor-svelte/lib/SignOut';
import SnapchatLogo from 'phosphor-svelte/lib/SnapchatLogo';
import SpeakerHigh from 'phosphor-svelte/lib/SpeakerHigh';
import SpeakerSimpleHigh from 'phosphor-svelte/lib/SpeakerSimpleHigh';
import SpotifyLogo from 'phosphor-svelte/lib/SpotifyLogo';
import SquaresFour from 'phosphor-svelte/lib/SquaresFour';
import Star from 'phosphor-svelte/lib/Star';
import Storefront from 'phosphor-svelte/lib/Storefront';
import Student from 'phosphor-svelte/lib/Student';
import Subtitles from 'phosphor-svelte/lib/Subtitles';
import ThreadsLogo from 'phosphor-svelte/lib/ThreadsLogo';
import Ticket from 'phosphor-svelte/lib/Ticket';
import TiktokLogo from 'phosphor-svelte/lib/TiktokLogo';
import Timer from 'phosphor-svelte/lib/Timer';
import Toolbox from 'phosphor-svelte/lib/Toolbox';
import Trash from 'phosphor-svelte/lib/Trash';
import TreeStructure from 'phosphor-svelte/lib/TreeStructure';
import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo';
import User from 'phosphor-svelte/lib/User';
import UserCircle from 'phosphor-svelte/lib/UserCircle';
import Users from 'phosphor-svelte/lib/Users';
import UsersFour from 'phosphor-svelte/lib/UsersFour';
import UsersThree from 'phosphor-svelte/lib/UsersThree';
import VideoCamera from 'phosphor-svelte/lib/VideoCamera';
import WhatsappLogo from 'phosphor-svelte/lib/WhatsappLogo';
import XCircle from 'phosphor-svelte/lib/XCircle';
import XLogo from 'phosphor-svelte/lib/XLogo';
import YoutubeLogo from 'phosphor-svelte/lib/YoutubeLogo';

export const toolkitIcons: [name: string, icon: Component<IconComponentProps>][] = [
  ['admissions', Student],
  ['alumni', GraduationCap],
  ['apply-now', PencilSimpleLine],
  ['arrow-down', ArrowDown],
  ['arrow-left', ArrowLeft],
  ['arrow-right', ArrowRight],
  ['arrow-up', ArrowUp],
  ['audio', SpeakerHigh],
  ['audio-transcript', Subtitles],
  ['back', ArrowUUpLeft],
  ['bill', Receipt],
  ['bluesky', Butterfly],
  ['calendar', Calendar],
  ['call', Phone],
  ['cancel', XCircle],
  ['check', Check],
  ['chevron-down', CaretDown],
  ['chevron-left', CaretLeft],
  ['chevron-right', CaretRight],
  ['chevron-up', CaretUp],
  ['clock', Clock],
  ['comment', ChatCircle],
  ['completion-time', Timer],
  ['cost', CurrencyDollar],
  ['directory', AddressBook],
  ['document', File],
  ['donor', HandHeart],
  ['download', DownloadSimple],
  ['email', Envelope],
  ['employment', Briefcase],
  ['event', CalendarStar],
  ['exit', SignOut],
  ['facebook', FacebookLogo],
  ['faculty', ChalkboardTeacher],
  ['family', UsersThree],
  ['faq', Question],
  ['favorite', Star],
  ['filter', Funnel],
  ['flickr', ImagesSquare],
  ['gift', Gift],
  ['github', GithubLogo],
  ['give', HandCoins],
  ['google-plus', GoogleLogo],
  ['grid', SquaresFour],
  ['handbook', BookOpen],
  ['home', House],
  ['hours', ClockCountdown],
  ['hr', IdentificationBadge],
  ['image', Image],
  ['inclusive', Heart],
  ['info', Info],
  ['instagram', InstagramLogo],
  ['intranet', Globe],
  ['job', Briefcase],
  ['laptop', Laptop],
  ['less', Minus],
  ['link', Link],
  ['linkedin', LinkedinLogo],
  ['list', List],
  ['location', MapPin],
  ['manual', Book],
  ['mastodon', MastodonLogo],
  ['menu', List],
  ['more', Plus],
  ['news', Newspaper],
  ['next', ArrowRight],
  ['notification', Bell],
  ['parent', UserCircle],
  ['partners', Handshake],
  ['pause', Pause],
  ['pay', CreditCard],
  ['pdf', FilePdf],
  ['phone', DeviceMobile],
  ['pinterest', PinterestLogo],
  ['plan', ListChecks],
  ['play', Play],
  ['podcast', Microphone],
  ['program-of-study', Exam],
  ['reddit', RedditLogo],
  ['research', Flask],
  ['resources', Toolbox],
  ['rss', Rss],
  ['safety', ShieldCheck],
  ['search', MagnifyingGlass],
  ['send', PaperPlaneTilt],
  ['settings', Gear],
  ['shop', Storefront],
  ['sitemap', TreeStructure],
  ['snapchat', SnapchatLogo],
  ['spotify', SpotifyLogo],
  ['staff', Users],
  ['students', Student],
  ['submit', PaperPlaneRight],
  ['substack', Article],
  ['team', UsersFour],
  ['threads', ThreadsLogo],
  ['tickets', Ticket],
  ['tiktok', TiktokLogo],
  ['training', Certificate],
  ['trash', Trash],
  ['twitter', TwitterLogo],
  ['unit', Buildings],
  ['user', User],
  ['video', VideoCamera],
  ['volume', SpeakerSimpleHigh],
  ['website', Browser],
  ['weibo', ChatsCircle],
  ['whatsapp', WhatsappLogo],
  ['workshop', Chalkboard],
  ['x', XLogo],
  ['yelp', Storefront],
  ['youtube', YoutubeLogo],
];
