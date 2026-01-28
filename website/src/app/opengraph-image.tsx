import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Citi Pirates 12U Baseball - Cooperstown 2026';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Read the cutout image
  const cutoutPath = join(process.cwd(), 'public/images/cutouts/zach-baden.png');
  const cutoutData = await readFile(cutoutPath);
  const cutoutBase64 = `data:image/png;base64,${cutoutData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 50%, #1a0000 100%)',
        }}
      >
        {/* Red glow from bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(204,0,0,0.4), transparent)',
          }}
        />

        {/* Player cutout on the right */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <img
            src={cutoutBase64}
            alt=""
            style={{
              height: '95%',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Text content on the left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            maxWidth: '650px',
          }}
        >
          <div
            style={{
              color: '#CC0000',
              fontSize: 24,
              fontWeight: 'bold',
              letterSpacing: '0.2em',
              marginBottom: 16,
            }}
          >
            12U BASEBALL
          </div>
          <div
            style={{
              color: 'white',
              fontSize: 80,
              fontWeight: 'bold',
              lineHeight: 1,
              marginBottom: 24,
              textShadow: '0 0 40px rgba(204,0,0,0.5)',
            }}
          >
            CITI PIRATES
          </div>
          <div
            style={{
              color: '#888',
              fontSize: 28,
              marginBottom: 32,
            }}
          >
            San Francisco&apos;s Road to Cooperstown
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                background: '#CC0000',
                color: 'white',
                padding: '12px 24px',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              SUMMER 2026
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
