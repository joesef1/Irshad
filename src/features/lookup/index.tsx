import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  addContactTime,
  addNationality,
  addSpecialization,
  appointmentStatusesQueryKey,
  contactTimesQueryKey,
  daysQueryKey,
  gendersQueryKey,
  getAllAppointmentStatuses,
  getAllContactTimes,
  getAllGenders,
  getAllMaritalStatuses,
  getAllNationalities,
  getAllSpecializations,
  getDaysNames,
  maritalStatusesQueryKey,
  nationalitiesQueryKey,
  specializationsQueryKey,
} from './api/lookup-api'
import { LookupAddListSection } from './components/lookup-add-list-section'
import { LookupStaticList } from './components/lookup-static-list'

export function Lookup() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Lookup Values</h2>
          <p className='text-muted-foreground'>
            Manage reference data used across the application.
          </p>
        </div>

        <Tabs defaultValue='nationality' className='flex flex-col gap-4'>
          <div className='w-full overflow-x-auto pb-1'>
            <TabsList>
              <TabsTrigger value='nationality'>Nationality</TabsTrigger>
              <TabsTrigger value='specialization'>Specialization</TabsTrigger>
              <TabsTrigger value='contact-time'>Contact Time</TabsTrigger>
              <TabsTrigger value='static-lists'>Static Lists</TabsTrigger>
            </TabsList>
          </div>

          {/* ── Tab 1: Nationality ── */}
          <TabsContent value='nationality'>
            <LookupAddListSection
              title='Nationality'
              addLabel='Nationality'
              queryKey={nationalitiesQueryKey}
              fetchFn={getAllNationalities}
              addFn={addNationality}
              placeholder='e.g. Saudi Arabian'
            />
          </TabsContent>

          {/* ── Tab 2: Specialization ── */}
          <TabsContent value='specialization'>
            <LookupAddListSection
              title='Specialization'
              addLabel='Specialization'
              queryKey={specializationsQueryKey}
              fetchFn={getAllSpecializations}
              addFn={addSpecialization}
              placeholder='e.g. Marriage Counseling'
            />
          </TabsContent>

          {/* ── Tab 3: Contact Time ── */}
          <TabsContent value='contact-time'>
            <LookupAddListSection
              title='Contact Time'
              addLabel='Contact Time'
              queryKey={contactTimesQueryKey}
              fetchFn={getAllContactTimes}
              addFn={addContactTime}
              placeholder='e.g. Morning (9am – 12pm)'
            />
          </TabsContent>

          {/* ── Tab 4: Static Lists ── */}
          <TabsContent value='static-lists'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <LookupStaticList
                title='Gender'
                queryKey={gendersQueryKey}
                fetchFn={getAllGenders}
              />
              <LookupStaticList
                title='Marital Status'
                queryKey={maritalStatusesQueryKey}
                fetchFn={getAllMaritalStatuses}
              />
              <LookupStaticList
                title='Appointment Status'
                queryKey={appointmentStatusesQueryKey}
                fetchFn={getAllAppointmentStatuses}
              />
              <LookupStaticList
                title='Days of the Week'
                queryKey={daysQueryKey}
                fetchFn={getDaysNames}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
