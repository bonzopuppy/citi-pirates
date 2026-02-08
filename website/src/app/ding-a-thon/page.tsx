import DingAThonForm from '@/components/DingAThonForm';
import playersData from '@/data/players.json';

export const metadata = {
  title: 'Ding-A-Thon Fundraiser | Citi Pirates 12U Baseball',
  description:
    'Pledge per stat to support the Citi Pirates 12U on their road to Cooperstown. Every hit, run, and strikeout counts toward their dream.',
};

export default function DingAThonPage() {
  return <DingAThonForm players={playersData.players} />;
}
