import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      toast.error('Veuillez entrer le code administrateur');
      return;
    }

    const success = loginAdmin(code);
    if (success) {
      toast.success('Connexion administrateur réussie');
      navigate('/admin');
    } else {
      toast.error('Code administrateur incorrect');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-6 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700">Accès Administrateur</h1>
          <p className="text-gray-600 mt-2">El Mazraa Bardo</p>
        </div>

        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Connexion Admin</CardTitle>
            <CardDescription>
              Entrez le code administrateur pour accéder au panneau de gestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-code">Code Administrateur</Label>
                <Input
                  id="admin-code"
                  type="password"
                  placeholder="Entrez le code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}