N=5;
q=2;
Nbr_Indicateur_Ini=N;
Indicateur=1:N;
L=length(Indicateur);
Center=mean(Indicateur);
Sep=0;
Comp=0;
for k=length(Indicateur):-1:q

      for i = 1:length(Indicateur)
            sublist = Indicateur;
            sublist(i) = [];
    
            G(i)= mean (sublist);
            Center_1=mean (G(i))
    
    
            Sep = Sep + (1/length(Indicateur))*sqrt((Center-Center_1)*(Center-Center_1)');
            
            for j = 1:length(sublist)
    
                Comp = Comp +(1/length(sublist))*sqrt((sublist(j)-G(i))*(sublist(j)-Center_1)');
    
            end
    
            J(i)= Sep/ Comp
    
            POS= find(J==max(J))

            Indicateur=sublist(find(J==max(J)))
     
      end

    %Indicateur=sublist(find(J==max(J)))

end

% % définition des variable d’entrée
n = nombre de lignes dans l’une des matrices données ( à vous de les définir !);
M = nombre de matrices données ( à vous de les définir !);
INDICATEURS_INITIAL= nombre d’indicateurs initiaux dans la série ( à vous de les définir !);
INDICATEURS_FINAL= nombre d’indicateurs finaux d ans la série ( à vous de les définir !);
%% Importation des matrices données de chaque matrice
MATRICE_DONNEE {1} = Importdata (‘ définissez le nom du fichier de la MATRICE 1’);
MATRICE_DONNEE {2} = Importdata (‘ définissez le nom du fichier de la MATRICE 2’);
MATRICE_DONNEE {M} = Importdata (‘ définissez le nom du fichier de la MATRICE M’);
