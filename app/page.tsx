import Hero from "./components/ui/main/Hero";
import HowItWork from "./components/ui/main/HowItWork";
import LiveDemo from "./components/ui/main/LiveDemo";
import Pricing from "./components/ui/main/Pricing";

export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWork />
      <LiveDemo />
      <Pricing />
    </div>
  );
}
