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
          <h2 className='text-2xl font-bold tracking-tight'>القيم المرجعية</h2>
          <p className='text-muted-foreground'>
            إدارة البيانات المرجعية المستخدمة في التطبيق.
          </p>
        </div>

        <Tabs defaultValue='nationality' className='flex flex-col gap-4'>
          <div className='w-full overflow-x-auto pb-1'>
            <TabsList>
              <TabsTrigger value='nationality'>الجنسيات</TabsTrigger>
              <TabsTrigger value='specialization'>التخصصات</TabsTrigger>
              <TabsTrigger value='contact-time'>أوقات التواصل</TabsTrigger>
              <TabsTrigger value='static-lists'>القوائم الثابتة</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='nationality'>
            <LookupAddListSection
              title='الجنسيات'
              addLabel='جنسية'
              queryKey={nationalitiesQueryKey}
              fetchFn={getAllNationalities}
              addFn={addNationality}
              placeholder='مثال: سعودي'
            />
          </TabsContent>

          <TabsContent value='specialization'>
            <LookupAddListSection
              title='التخصصات'
              addLabel='تخصص'
              queryKey={specializationsQueryKey}
              fetchFn={getAllSpecializations}
              addFn={addSpecialization}
              placeholder='مثال: الإرشاد الزوجي'
            />
          </TabsContent>

          <TabsContent value='contact-time'>
            <LookupAddListSection
              title='أوقات التواصل'
              addLabel='وقت تواصل'
              queryKey={contactTimesQueryKey}
              fetchFn={getAllContactTimes}
              addFn={addContactTime}
              placeholder='مثال: الصباح (9 ص – 12 م)'
            />
          </TabsContent>

          <TabsContent value='static-lists'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <LookupStaticList
                title='الجنس'
                queryKey={gendersQueryKey}
                fetchFn={getAllGenders}
              />
              <LookupStaticList
                title='الحالة الاجتماعية'
                queryKey={maritalStatusesQueryKey}
                fetchFn={getAllMaritalStatuses}
              />
              <LookupStaticList
                title='حالة الموعد'
                queryKey={appointmentStatusesQueryKey}
                fetchFn={getAllAppointmentStatuses}
              />
              <LookupStaticList
                title='أيام الأسبوع'
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
