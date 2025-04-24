export default function AutoPlayVideo() {
  return (
    <div className="w-full max-h-[700px] overflow-hidden rounded-2xl shadow-lg my-10">
      <video
        className="w-full h-full object-cover"
        src="/videos/key_features.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
