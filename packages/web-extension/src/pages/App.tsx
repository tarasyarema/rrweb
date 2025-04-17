import { Route, Routes } from 'react-router-dom';
import SidebarWithHeader from '~/components/SidebarWithHeader';
import { SessionList } from './SessionList';
import { FiList, FiSettings } from 'react-icons/fi';
import Player from './Player';

export default function App() {
  return (
    <SidebarWithHeader
      title="desplega.ai"
      headBarItems={[
        {
          label: 'Settings',
          icon: FiSettings,
          href: '/options/index.html#',
        },
        {
          label: 'Sessions',
          icon: FiList,
          href: '#',
        },
      ]}
      sideBarItems={[]}
    >
      <Routes>
        <Route path="/" element={<SessionList />} />
        <Route path="session/:sessionId" element={<Player />} />
      </Routes>
    </SidebarWithHeader>
  );
}
