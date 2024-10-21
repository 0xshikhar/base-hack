
import { useProfile } from '@farcaster/auth-kit';

export default function FarcasterProfile() {
    const profile = useProfile();
    const {
        isAuthenticated,
        profile: { fid, displayName, custody },
    } = profile;

    return (
        <>
            {isAuthenticated ? (
                <div>
                    <p>
                        👋 {displayName} (FID: {fid})
                    </p>
                    <div className='text-[10px]'>Your custody address is: {custody}</div>
                </div>
            ) : (
                <p>
                    Verify your Farcaster identity
                </p>
            )}
        </>
    );
}