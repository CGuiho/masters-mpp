% NOM = ls('acc_*.csv');
% Numero_fichier = NOM (1,:);
% X= importdata(NOM(Numero_fichier,:));

TEMPS =[]; 
INDICATEUR=[];
NOM = ls('acc_*.csv');
X= importdata(NOM(1,:));
%BASE_TEMPS=X(1,1)*60+X(1,2)+X(1,3)/60+X(1,4)*(10^-6/60);
for i= 10:70
    Numero_fichier = i;
    X= importdata(NOM(Numero_fichier,:));
 % X= importdata("acc_02803.csv");
size(X)
 Vibh = X(:,2);

 Te= 0.1/2560;

 t=Te*(1:2560)';

% plot(t,Vibh)
%Calcule de l'energie du signal
E=sum(Vibh.^2);
%Calcule de la puissance du signal

P=(1/2560)* sum(Vibh.^2);

% determinons la valeur Crete

VibhA=abs(Vibh);
% recherchons la valeur max du signal

POS=find(abs(Vibh)==max(abs(Vibh)));

SCRETE=VibhA(POS(1));

% calcule de la moyenne
Moyenne = mean(Vibh);

%Calcule de la valeur efficace du signal

SEFF = sqrt( (1/2560)* sum((Vibh- mean(Vibh)).^2));
% SMOY =  ix x = (Vibh- mean(Vibh))
% SMOY 2 = (Vibh- mean(Vibh)).^2

% Calculons le KURTOSIS

SKURT = ((1/2560)*sum((Vibh- mean(Vibh)).^4))/((SEFF).^4);

% Calcule du Facteur de crete

Fc = SCRETE/SEFF;

% Calcule du Facteur K

FK = SCRETE * SEFF;

%TEMPS(i)=X(1,1)*60+X(1,2)+X(1,3)/60+X(1,4)*(10^-6/60)-BASE_TEMPS;
Tot= [E,P,SCRETE ,Moyenne ,SEFF ,SKURT ,Fc ,FK]; 

for k= 1:8
    INDICATEUR(i,k) = Tot(k);
end

end
writematrix(INDICATEUR, 'tp1_Equilibrator_defaut_bague_bille.xlsx');
% subplot(2,4,1)
% plot(TEMPS,INDICATEUR(1,:))
% ylabel('E')
% xlabel('temps(minutes)')

