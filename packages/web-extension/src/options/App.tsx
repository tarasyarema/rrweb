import { Route, Routes } from 'react-router-dom';
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { FiList, FiSave, FiSettings } from 'react-icons/fi';
import { Alert, AlertDescription, AlertTitle, Box, HStack, IconButton, Input, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApiKey, upsertApiKey } from '~/utils/storage';

export const Settings = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    void getApiKey().then((keys) => {
      if (keys.length > 0) {
        setApiKey(keys[0]);
      }
    });
  }, []);

  return (
    <Box p={10}>
      <Stack>
        <Alert status="info" mb="4">
          <AlertTitle>
            API Key
          </AlertTitle>
          <AlertDescription>
            You can find your API key in your account settings.
          </AlertDescription>
        </Alert>
        <HStack alignItems="center">
          <Input
            placeholder="API Key"
            size="md"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            width="240px"
          />
          <IconButton
            colorScheme="teal"
            disabled={!apiKey || apiKey.length === 0}
            onClick={() => {
              void upsertApiKey(apiKey)
            }}
            aria-label="Save API Key"
          >
            <FiSave />
          </IconButton>
        </HStack>
      </Stack>
    </Box>
  )
}

export default function App() {
  return (
    <SidebarWithHeader
      title="qafor.me"
      headBarItems={[
        {
          label: 'Settings',
          icon: FiSettings,
          href: '#',
        },
        {
          label: 'Sessions',
          icon: FiList,
          href: '/pages/index.html#',
        },
      ]}
      sideBarItems={[]}
    >
      <Routes>
        <Route path="/" element={<Settings />} />
      </Routes>
    </SidebarWithHeader>
  );
}
