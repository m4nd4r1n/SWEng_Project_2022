interface Error {
  children: React.ReactNode;
}

export default function Error({ children }: Error) {
  return <span className="flex justify-center text-red-500">{children}</span>;
}
