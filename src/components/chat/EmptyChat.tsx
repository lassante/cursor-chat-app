export const EmptyChat = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold">Welcome to Chatly</h2>
        <p className="text-muted-foreground">
          Select a chat from the right to start messaging
        </p>
      </div>
    </div>
  );
};
