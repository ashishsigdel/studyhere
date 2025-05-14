export function formatNumbers(numbers: number): string {
  if (numbers >= 1_000_000_000)
    return (numbers / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " B";
  if (numbers >= 1_000_000)
    return (numbers / 1_000_000).toFixed(1).replace(/\.0$/, "") + " M";
  if (numbers >= 1_000)
    return (numbers / 1_000).toFixed(1).replace(/\.0$/, "") + " K";
  return numbers.toString();
}
