import { Flex } from "@radix-ui/themes";

export default function Header() {
  return (
    <Flex gap="2" p="4" pl="0">
      <a>Clinical Info</a>
      <a>Recording</a>
      <a>Report</a>
    </Flex>
  );
}
