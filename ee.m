% Initialisation du matériel d'acquisition NI (National Instruments)
d = daq.getDevices();
s = daq.createSession('ni');
s.addAnalogInputChannel('cDAQ11Mod1', 0, 'Accelerometer');

% Création d'une figure pour la visualisation en temps réel
p = plot(0,0);
xlabel('Temps (secondes)');
ylabel('Accélération sur axe X (m/s2)');

% Configuration des paramètres d'acquisition
s.Rate = 25.6e3; % Fréquence d'échantillonnage de 25.6 kHz
s.DurationInSeconds = 1; % Durée de chaque acquisition : 1 seconde
s.Channels(1).Sensitivity = 0.01; % Sensibilité de l'accéléromètre

% Boucle pour réaliser 70 acquisitions consécutives
for i=1:70
    % Démarrage de l'acquisition et récupération des données et du temps
    [data,time] = s.startForeground;
    
    % Création d'un horodatage précis pour chaque mesure
    AA=num2str(clock);
    AA=str2num(AA);
    temps=AA(4)*3600+AA(5)*60+AA(6);
    TEMPS=temps*ones(length(time),1);
    
    % Concaténation de l'horodatage et des données d'accélération
    XX=[TEMPS, data];

    % Génération d'un nom de fichier formaté (ex: acc_00001.csv)
    FILE=num2str(i);
    filename=[];

    if i <= 9
        filename=['acc_' '0' '0' '0' '0' FILE '.' 'csv'];
    end

    if 9 < i && i <= 99
        filename=['acc_' '0' '0' '0' FILE '.' 'csv'];
    end

    if 99 < i && i <= 999
        filename=['acc_' '0' '0' FILE '.' 'csv'];
    end

    % Écriture des données dans le fichier CSV
    csvwrite(filename,XX)
    
    % Mise à jour du graphique pour un suivi en direct
    set(p,'xdata',time,'ydata',data(:,1));
    drawnow
end

close all
