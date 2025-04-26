'use client';

interface CashierImageCardProps {
  id: string;
  imageId: string;
  imageName: string;
  lengthMeters: number;
  createdAt: string;
  expiresAt: string;
}

export default function CashierImageCard({ 
  id, 
  imageId, 
  imageName, 
  lengthMeters, 
  createdAt, 
  expiresAt 
}: CashierImageCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedTime = new Date(createdAt).toLocaleTimeString();

  const now = new Date();
  const expiration = new Date(expiresAt);
  const timeRemaining = expiration.getTime() - now.getTime();
  const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60)));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img
          src={`/api/images/${imageId}/data`}
          alt={imageName}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{imageName}</h3>

        <div className="mt-2 bg-blue-50 p-3 rounded-md">
          <p className="text-lg font-bold text-blue-800">
            Length: {lengthMeters} meters
          </p>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          <p>Submitted: {formattedDate} at {formattedTime}</p>
          <p className="mt-1">
            {minutesRemaining > 0 ? (
              <span className="text-orange-600">
                Expires in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-red-600">Expired</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
