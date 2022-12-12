export const fetchGroups = fetch => async (isMine) => fetch('groups' + (isMine ? '?mine=true' : ''));

export const fetchGroup = fetch => async id => fetch(`groups/${id}`);

export const fetchUsers = fetch => async () => fetch('users');

export const fetchCreateGroup = fetch => async newGroup =>
    fetch('groups', {
        method: 'POST',
        body: JSON.stringify(newGroup),
    });

export const fetchUpdateGroup = fetch => async newGroup =>
    fetch('groups', {
        method: 'PUT',
        body: JSON.stringify(newGroup),
    });
