import logoLight from '../assets/predictpoint-logo-v2-ondark-mono.svg';
import logoDark  from '../assets/predictpoint-logo-v2-ondark-orange.svg';

export function Brand({ size = 28 }: { size?: number }) {
    return (
        <picture>
            <source srcSet={logoDark} media="(prefers-color-scheme: dark)" />
            <img src={logoLight} alt="predictpoint" height={size} />
        </picture>
    );
}