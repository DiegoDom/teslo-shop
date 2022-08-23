import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { PeopleOutline } from '@mui/icons-material'

import { AdminLayout } from '../../components/layouts'
import { Loader } from '../../components/ui'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'
import { IRole } from '../../interfaces/user'

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (!error && !data) {
    return <Loader />
  }

  const onRoleUpdated = async (userId: string, newRole: IRole) => {
    const previousUsers = users.map((user) => ({ ...user }))

    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put('/admin/users', {
        userId,
        role: newRole,
      })
    } catch (error) {
      setUsers(previousUsers);
      console.log(error)
      alert('No se pudo actualizar el rol del usuario')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Correo electrónico',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      width: 300,
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: '300px' }}
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="client">Cliente</MenuItem>
          </Select>
        )
      },
    },
  ]

  const rows = users.map(({ _id, email, name, role }) => ({
    id: _id,
    email,
    name,
    role,
  }))

  return (
    <AdminLayout
      title="Administración de usuarios"
      subTitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ my: 2, height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UsersPage
