import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginAdmin(code)) {
      toast.success('Connexion réussie');
      navigate('/admin');
    } else {
      toast.error('Code administrateur incorrect');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-900">
        <CardHeader className="space-y-1 bg-gradient-to-r from-green-900 to-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-green-400">
            Espace Administrateur
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            El Mazraa Bardo
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Code Administrateur
              </label>
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez le code"
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Accès réservé aux administrateurs autorisés
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}