export const getNameGradient = (name: string) => {
  const gradients = [
    "from-violet-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-fuchsia-500 to-pink-500",
    "from-orange-500 to-amber-500",
    "from-cyan-500 to-blue-500",
  ];

  // Use string charCode sum to pick a consistent gradient
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[sum % gradients.length];
};
