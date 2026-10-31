import { Composition } from "remotion";
import { VacatureReel, standaardProps, DUUR, berekenDuur } from "./VacatureReel";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VacatureReel"
    component={VacatureReel}
    durationInFrames={DUUR}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={standaardProps}
    calculateMetadata={({ props }) => ({ durationInFrames: berekenDuur(props) })}
  />
);
