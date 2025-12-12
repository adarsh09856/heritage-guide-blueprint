import { useState } from 'react';
import { Search, Shield, User, ShieldCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsers, useUpdateUserRole } from '@/hooks/useUsers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const UsersManager = () => {
  const { data: users = [], isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'user'>('user');

  const filtered = users.filter(u =>
    (u.profile?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    try {
      await updateRoleMutation.mutateAsync({ userId: editingUser.id, role: newRole });
      toast.success('Role updated!');
      setEditingUser(null);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-gold" />;
      case 'editor': return <Shield className="w-4 h-4 text-forest" />;
      default: return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gold/10 text-gold';
      case 'editor': return 'bg-forest/10 text-forest';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-background rounded-xl shadow-heritage-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.profile?.avatar_url ? (
                          <img 
                            src={user.profile.avatar_url} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.profile?.display_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{user.user_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingUser({ 
                            id: user.user_id, 
                            email: user.profile?.display_name || user.user_id,
                            role: user.role 
                          });
                          setNewRole(user.role as 'admin' | 'editor' | 'user');
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Change Role
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Changing role for: <span className="font-medium text-foreground">{editingUser?.email}</span>
            </p>
            <div>
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'editor' | 'user')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
