"use client";

interface CashierImageCardProps {
  id: string;
  imageId: string;
  imageName: string;
  lengthMeters: number;
  createdAt: string;
}

export default function CashierImageCard({
  imageId,
  imageName,
  lengthMeters,
  createdAt,
}: CashierImageCardProps) {
  const formattedTime = new Date(createdAt).toLocaleTimeString().slice(0, 5);

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
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {imageName}
        </h3>

        <div className="mt-2 bg-blue-50 p-3 rounded-md">
          <p className="text-lg font-bold text-blue-800">
            Довжина: {lengthMeters}м.
          </p>
        </div>

        <div className="mt-2 text-sm text-gray-500">
          <p>
            Додано: в {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
}
