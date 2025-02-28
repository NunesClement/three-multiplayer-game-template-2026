export default function Instructions({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">Island Adventure</h1>
        <div className="mb-6 space-y-4 text-left">
          <p>Explore a beautiful island with multiple movement modes:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <span className="font-semibold">Walk</span> on the island (WASD keys)
            </li>
            <li>
              <span className="font-semibold">Submarine</span> mode in water (automatically activates)
            </li>
            <li>
              <span className="font-semibold">Rocket</span> mode to the stars (press SPACE)
            </li>
          </ul>
          <p className="mt-4">
            <span className="font-semibold">Controls:</span>
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>WASD - Move around</li>
            <li>Mouse - Look around</li>
            <li>SPACE - Activate/deactivate rocket mode</li>
            <li>ESC - Pause game</li>
          </ul>
        </div>
        <button onClick={onStart} className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
          Start Adventure
        </button>
      </div>
    </div>
  )
}

