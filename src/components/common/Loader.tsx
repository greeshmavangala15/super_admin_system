interface LoaderProps {
  message?: string;
}

function Loader({
  message = "Loading...",
}: LoaderProps) {
  return (
    <div className="loader">
      <div className="loader-spinner" />
      <p>{message}</p>
    </div>
  );
}

export default Loader;