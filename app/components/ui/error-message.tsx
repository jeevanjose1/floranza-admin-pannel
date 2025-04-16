
type Props = {
  error: string | null | undefined;
  id?: string;
};

export default function ErrorMessage({ error, id }: Props) {
  if (!error) return null;

  return (
    <p id={id} className="text-[13px] text-error">
      {error}
    </p>
  );
}
