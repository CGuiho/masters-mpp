d = daq.getDevices();
s = daq.createSession('ni');
s.addAnalogInputChannel('cDAQ11Mod1', 0, 'Accelerometer');


p = plot(0,0);
xlabel('Temps (secondes)');
ylabel('Accéleration sur axe X m/s2');


s.Rate = 25.6e3;
s.DurationInSeconds = 1;
s.Channels(1).Sensitivity = 0.01;


for i=1:70
% data = s.inputSingleScan;
[data,time] = s.startForeground;
AA=num2str(clock);
AA=str2num(AA);
temps=AA(4)*3600+AA(5)*60+AA(6);
TEMPS=temps*ones(length(time),1);
XX=[TEMPS, data];


 
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

csvwrite(filename,XX)
set(p,'xdata',time,'ydata',data(:,1));


drawnow

% pause (1)
end

close all