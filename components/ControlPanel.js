import { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";

export default function ControlPanel({ onSubmit }) {
  const [days, setDays] = useState(0);

  const handleSubmit = () => {
    onSubmit(days);
  };

  return (
    <Box p={5} bg="gray.800" color="white">
      <Text>Enter number of days:</Text>
      <Input
        value={days}
        onChange={(e) => setDays(e.target.value)}
        placeholder="Number of days"
        mb={3}
      />
      <Button onClick={handleSubmit} colorScheme="teal">
        Calculate
      </Button>
    </Box>
  );
}
