import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [registerNom, setRegisterNom] = useState('');
  const [registerPrenom, setRegisterPrenom] = useState('');
  const [registerTelephone, setRegisterTelephone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoading(false);

    if (result.success) {
      toast.success('Connexion réussie !');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerNom || !registerPrenom || !registerTelephone || !registerEmail || !registerPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    const result = await register(
      registerNom,
      registerPrenom,
      registerTelephone,
      registerEmail,
      registerPassword
    );
    setIsLoading(false);

    if (result.success) {
      toast.success('Inscription réussie !');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const handleContact = () => {
    window.location.href = 'tel:+21699003404';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        {/* Logo et Titre */}
        <div className="text-center mb-8">
          <img 
            src="https://mgx-backend-cdn.metadl.com/generate/images/285865/2025-12-31/87ec13e4-6abd-485e-9853-974e6fa6189b.png" 
            alt="El Mazraa Bardo" 
            className="h-24 w-24 mx-auto mb-4 rounded-full shadow-lg shadow-green-900/50 object-contain border-2 border-green-500"
          />
          <h1 className="text-3xl font-bold text-green-400 mb-2">El Mazraa Bardo</h1>
          <p className="text-green-500 italic">la nature dans votre assiette</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-900 border border-gray-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Inscription</TabsTrigger>
          </TabsList>

          {/* Connexion */}
          <TabsContent value="login">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-green-400">Connexion</CardTitle>
                <CardDescription className="text-gray-400">
                  Connectez-vous à votre compte pour commander
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inscription */}
          <TabsContent value="register">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-green-400">Inscription</CardTitle>
                <CardDescription className="text-gray-400">
                  Créez votre compte pour commencer vos achats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-nom" className="text-gray-300">Nom *</Label>
                      <Input
                        id="register-nom"
                        type="text"
                        placeholder="Nom"
                        value={registerNom}
                        onChange={(e) => setRegisterNom(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-prenom" className="text-gray-300">Prénom *</Label>
                      <Input
                        id="register-prenom"
                        type="text"
                        placeholder="Prénom"
                        value={registerPrenom}
                        onChange={(e) => setRegisterPrenom(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-telephone" className="text-gray-300">Téléphone *</Label>
                    <Input
                      id="register-telephone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={registerTelephone}
                      onChange={(e) => setRegisterTelephone(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">Mot de passe *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-gray-300">Confirmer le mot de passe *</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-green-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bouton Contact et Lien Admin */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleContact}
            variant="outline"
            className="w-full border-gray-700 bg-gray-900 text-green-400 hover:bg-gray-800 hover:text-green-300"
          >
            <Phone className="mr-2 h-4 w-4" />
            Contactez-nous : +216 99 003 404
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate('/admin/login')}
              className="text-green-500 hover:text-green-400"
            >
              Accès administrateur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}