import UserList from './user-list'


export const runtime = 'nodejs';

export default async function UsersPage() {
    return (
        <div className="bg-white rounded-lg p-6">
            <UserList />
        </div>
    )
} 