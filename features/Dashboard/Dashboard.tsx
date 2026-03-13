import React from 'react';
import DashboardStats from '../../components/DashboardStats';

export default function Dashboard(props: any) {
    const {
        user, expenses, trips, setView, jobs, surveys, allUsers, timeEntries, absenceRequests,
        praiseList, reviews, goals, applications
    } = props;

    return (
        <DashboardStats
            user={user}
            expenses={expenses || []}
            trips={trips || []}
            timeEntries={timeEntries || []}
            absenceRequests={absenceRequests || []}
            jobs={jobs || []}
            applications={applications || []}
            goals={goals || []}
            surveys={surveys || []}
            reviews={reviews || []}
            praiseList={praiseList || []}
            allUsers={allUsers || []}
            setView={setView}
        />
    );
}
